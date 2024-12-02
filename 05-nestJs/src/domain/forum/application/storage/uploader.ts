/* eslint-disable prettier/prettier */
interface UploadParams {
  fileName: string
  fileType: string
  body: Buffer
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}