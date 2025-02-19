import {Either} from '../helpers/types'

export type ApiResponseError = {
  status: number
  message: string
}

export type ApiResponseSuccess<T> = {
  status: number
  data: T
}

export type ApiResponse<T> = Either<ApiResponseError, ApiResponseSuccess<T>>
