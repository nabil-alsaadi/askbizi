export class FileUpload {
  name?: string;
  originalName?: string;
  url?: string;
  path?: string;
  error?: string;
  file: File;
  type?: string;

  constructor(file: File) {
    this.file = file;
  }
}

export interface FileUploaderValue {
  url?: string;
  path?: string;
  fileName?: string;
}
