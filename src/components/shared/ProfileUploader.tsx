import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"

import { convertFileToUrl } from "@/lib/utils"
import { CircleUser } from "lucide-react"

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void
  mediaUrl: string
}

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
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
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="cursor-pointer flex items-center gap-2 text-gray-800">
        {fileUrl ? (
          <img
            src={fileUrl}
            alt="image"
            className="h-12 w-12 rounded-full object-cover object-top"
          />
        ) : (
          <CircleUser strokeWidth={1.25} className="h-12 w-12" />
        )}
        <p className="text-xs font-medium text-center text-gray-900">
          {fileUrl ? "Looking good!" : "Click or drag to upload photo"}
        </p>
      </div>
    </div>
  )
}

export default ProfileUploader
