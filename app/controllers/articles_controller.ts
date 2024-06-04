// import type { HttpContext } from '@adonisjs/core/http'

import { HTTP } from '#lib/constants/http'
import Article from '#models/article'
import fileService from '#services/file_service'
import googleCloudStorageService from '#services/google_cloud_storage_service'
import env from '#start/env'
import responseFormatter from '#utils/response_formatter'
import { articleUpdateValidator, articleValidator } from '#validators/article'
import { HttpContext } from '@adonisjs/core/http'
import * as nano from 'nanoid'

export default class ArticlesController {
  private admins = env
    .get('ADMINS')
    .split(',')
    .map((admin) => Number.parseInt(admin))

  async index() {
    const articles = await Article.query().orderBy('created_at', 'asc')

    return responseFormatter(HTTP.OK, 'success', 'Get list of articles', articles)
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    if (!this.admins.includes(userId!)) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const { title, description, image } = await request.validateUsing(articleValidator)

    const imageUrl = await googleCloudStorageService.save(
      'article',
      image.tmpPath!,
      `article-${nano.nanoid(16)}.${image.extname}`
    )

    if (imageUrl.error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
      )
    }

    try {
      // Create article
      const newArticle = await Article.create({
        title,
        description,
        imageUrl: imageUrl.data,
      })

      return response.created(
        responseFormatter(HTTP.CREATED, 'success', 'Create article success', newArticle)
      )
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const articleId = params.id

    if (!this.admins.includes(userId!)) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    const { title, description, image } = await request.validateUsing(articleUpdateValidator)

    try {
      const targetedArticle = await Article.findBy('id', articleId)

      if (!targetedArticle) {
        return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'Article not found'))
      }

      if (await fileService.isFileExists(targetedArticle.imageUrl, 'article')) {
        await fileService.delete(targetedArticle.imageUrl, 'article')
      }

      if (image) {
        if (targetedArticle.imageUrl) {
          const imageUrl = await googleCloudStorageService.delete(
            'article',
            targetedArticle.imageUrl
          )

          if (imageUrl.error) {
            return response.internalServerError(
              responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
            )
          }
        }

        const imageUrl = await googleCloudStorageService.save(
          'article',
          image.tmpPath!,
          `article-${nano.nanoid(16)}.${image.extname}`
        )

        if (imageUrl.error) {
          return response.internalServerError(
            responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
          )
        }

        targetedArticle.imageUrl = imageUrl.data
      }

      // Set new value or keep the old value if the new value is null or undefined
      targetedArticle.title = title || targetedArticle.title
      targetedArticle.description = description || targetedArticle.description

      await targetedArticle.save()

      // rename targetedArticle.imageUrl to ${APP_URL}/${targetedArticle.imageUrl}

      return response.ok(
        responseFormatter(HTTP.OK, 'success', 'Update article success', targetedArticle)
      )
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }

  async destroy({ auth, params, response }: HttpContext) {
    const userId = auth.use('jwt').user?.id

    const articleId = params.id

    if (!this.admins.includes(userId!)) {
      return response.forbidden(responseFormatter(HTTP.FORBIDDEN, 'error', 'Forbidden'))
    }

    try {
      const targetedArticle = await Article.findBy('id', articleId)

      if (!targetedArticle) {
        return response.notFound(responseFormatter(HTTP.NOT_FOUND, 'error', 'Article not found'))
      }

      if (targetedArticle.imageUrl) {
        const imageUrl = await googleCloudStorageService.delete('article', targetedArticle.imageUrl)

        if (imageUrl.error) {
          return response.internalServerError(
            responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', imageUrl.message)
          )
        }
      }

      await targetedArticle.delete()

      return response.ok(responseFormatter(HTTP.OK, 'success', 'Delete article success'))
    } catch (error) {
      return response.internalServerError(
        responseFormatter(HTTP.INTERNAL_SERVER_ERROR, 'error', error.message)
      )
    }
  }
}