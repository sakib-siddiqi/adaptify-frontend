import { ChangeEventHandler, useState } from "react";
type Props = {
    onChange : (file : File)=>void
}
const FileUpload = (props : Props) => {
    const [preview, setPreview] = useState<string | undefined>();
    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const file = event.target.files?.[0];
        if(file) props.onChange(file);
        // image preview with data64 bit url
        if (file?.type.startsWith("image/")) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => setPreview(fileReader?.result as string)
        }
    }
    return (
        <div className='mt-3'>
            <label className="mb-1 text-sm font-medium" htmlFor="verification-file">Upload Passport/NID</label>
            <input
                onChange={onChange}
                id="verification-file"
                type="file"
                accept=".png, .jpg, .jpeg, .pdf"
                className="input"
            />
            {preview ? (
                <img
                    src={preview}
                    alt="Preview"
                    className="aspect-video w-full rounded-md object-contain bg-gray-100 border border-gray-300 mx-auto mt-2"
                />
            ) : null}
        </div>
    );
};

export default FileUpload;