import { useCallback, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"

import { convertFileToUrl } from "@/lib/utils"
import { SquareUser } from "lucide-react"

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

      <div className="cursor-pointer flex items-center gap-4 hover:underline">
        {fileUrl ? (
          <img
            src={fileUrl}
            alt="image"
            className="h-14 w-14 rounded-full object-cover object-top"
          />
        ) : (
          <SquareUser strokeWidth={1.25} className="h-14 w-14" />
        )}
        <p className="text-xs text-center">
          {fileUrl ? "Looking good!" : "Upload photo"}
        </p>
      </div>
    </div>
  )
}

export default ProfileUploader
