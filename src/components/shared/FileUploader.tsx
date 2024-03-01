import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import { convertFileToUrl } from "@/lib/utils"
import { Button } from "../ui/button"

type FileUploaderProps = {
  fieldChange: (files: File[]) => void
  mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles)
      fieldChange(acceptedFiles)
      setFileUrl(convertFileToUrl(acceptedFiles[0]))
    },
    [file]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  })

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center border rounded-lg cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {fileUrl ? (
        <>
          <div className="w-48 pt-6">
            <img
              src={fileUrl}
              alt="image"
              className="object-cover object-top"
            />
          </div>
          <p className="text-sm py-4">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="flex items-center flex-col p-6">
          <img
            src="/assets/file-upload.svg"
            width={96}
            height={77}
            alt="file upload"
          />

          <h3 className="mb-2 mt-6">Drag photo here</h3>
          <p className="text-sm mb-6">SVG, PNG, JPG</p>

          <Button>Select from computer</Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader
