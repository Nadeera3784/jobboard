import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { HeadObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3';

import {
  FileOptions,
  StorageDriver$FileMetadataResponse,
  StorageDriver$PutFileResponse,
  StorageDriver$RenameFileResponse,
  FileSystemModuleOptions,
} from './interfaces';
import { FILE_SYSTEM_MODULE_OPTIONS_TOKEN } from './filesystem.constants';

@Injectable()
export class FilesystemService {
  private client;
  private config;
  constructor(
    @Inject(FILE_SYSTEM_MODULE_OPTIONS_TOKEN)
    fileSystemOptions: FileSystemModuleOptions,
  ) {
    const options = {
      accessKeyId: fileSystemOptions.accessKeyId,
      secretAccessKey: fileSystemOptions.secretAccessKey,
      region: fileSystemOptions.region,
    };
    this.config = {
      ...options,
      bucket: fileSystemOptions.bucket,
    };

    this.client = new S3(options);
  }

  public async put(
    path: string,
    fileContent: any,
    options?: FileOptions,
  ): Promise<StorageDriver$PutFileResponse> {
    const { mimeType } = options || {};
    const file = `${Date.now().toString()}-${path}`;
    const params = {
      Bucket: this.config.bucket,
      Key: file,
      Body: fileContent,
      ContentType: mimeType ? mimeType : this.getMimeFromExtension(file),
      ACL: 'public-read',
    } as PutObjectRequest;
    const reponse = await this.client.upload(params).promise();
    return { url: this.url(file), path: file };
  }

  /**
   * Get Signed Urls
   * @param path
   */
  public signedUrl(path: string, expireInMinutes = 20): string {
    const params = {
      Bucket: this.config.bucket,
      Key: path,
      Expires: 60 * expireInMinutes,
    };

    const signedUrl = this.client.getSignedUrl('getObject', params);

    return signedUrl;
  }

  /**
   * Get file stored at the specified path.
   *
   * @param path
   */
  public async get(path: string): Promise<Buffer | null> {
    try {
      const params = { Bucket: this.config.bucket || '', Key: path };
      const res = await this.client.getObject(params).promise();
      return res.Body as Buffer;
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if file exists at the path.
   *
   * @param path
   */
  public async exists(path: string): Promise<boolean> {
    const meta = await this.meta(path);
    return Object.keys(meta).length > 0 ? true : false;
  }

  /**
   * Get object's metadata
   * @param path
   */
  public async meta(path: string): Promise<StorageDriver$FileMetadataResponse> {
    const params = {
      Bucket: this.config.bucket,
      Key: path,
    };

    try {
      const res = await this.client
        .headObject(params as HeadObjectRequest)
        .promise();
      return {
        path: path,
        contentType: res.ContentType,
        contentLength: res.ContentLength,
        lastModified: res.LastModified,
      };
    } catch (e) {
      return {};
    }
  }

  /**
   * Check if file is missing at the path.
   *
   * @param path
   */
  public async missing(path: string): Promise<boolean> {
    const meta = await this.meta(path);
    return Object.keys(meta).length === 0 ? true : false;
  }

  /**
   * Get URL for path mentioned.
   *
   * @param path
   */
  public url(path: string): string {
    const url = this.signedUrl(path, 20).split('?')[0];
    return url;
  }

  /**
   * Delete file at the given path.
   *
   * @param path
   */
  public async delete(path: string): Promise<boolean> {
    const params = { Bucket: this.config.bucket || '', Key: path };
    try {
      await this.client.deleteObject(params).promise();
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Copy file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  public async copy(
    path: string,
    newPath: string,
  ): Promise<StorageDriver$RenameFileResponse> {
    await this.client
      .copyObject({
        Bucket: this.config.bucket || '',
        CopySource: this.config.bucket + '/' + path,
        Key: newPath,
      })
      .promise();
    return { path: newPath, url: this.url(newPath) };
  }

  /**
   * Move file internally in the same disk
   *
   * @param path
   * @param newPath
   */
  public async move(
    path: string,
    newPath: string,
  ): Promise<StorageDriver$RenameFileResponse> {
    await this.copy(path, newPath);
    await this.delete(path);
    return { path: newPath, url: this.url(newPath) };
  }

  /**
   * Get instance of driver's client.
   */
  public getClient(): S3 {
    return this.client;
  }

  /**
   * Get config of the driver's instance.
   */
  public getConfig(): Record<string, any> {
    return this.config;
  }

  private extensions: { [key: string]: any } = {
    'image/gif': 'gif',
    'image/jpeg': 'jpeg jpg',
    'image/png': 'png',
    'image/tiff': 'tif tiff',
    'image/vnd.wap.wbmp': 'wbmp',
    'image/x-icon': 'ico',
    'image/x-jng': 'jng',
    'image/x-ms-bmp': 'bmp',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
  };

  private getMimeFromExtension = (fileName: string): string => {
    const extension: string = fileName.substr(fileName.indexOf('.') + 1);
    return (
      Object.keys(this.extensions).find(
        (key) => this.extensions[key] === extension,
      ) || '*/*'
    );
  };
}
