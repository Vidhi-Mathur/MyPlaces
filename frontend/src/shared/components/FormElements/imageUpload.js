import {useRef, useState, useEffect} from "react";
import Button from "./Button";
import './imageUpload.css'

const ImageUpload = ({onInput, id, center, errorText}) => {
    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)
    const filePickRef = useRef()

    useEffect(() =>{
        if(!file) return;
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }, [file])

    const pickedHandler = (e) => {
    let extractedFile;
    let fileIsValid = isValid
    if(e.target.files && e.target.files.length === 1){
        extractedFile = e.target.files[0];
        setFile(extractedFile)
        setIsValid(true)
        fileIsValid = true
    }
    else{
        setIsValid(false)
        fileIsValid = false
    }
    onInput(id, extractedFile, fileIsValid)
    }

    const pickImageHandler = () => {
        filePickRef.current.click()
    }

    return (
        <div className="form-control">
            <input id={id}  ref={filePickRef} style={{display: 'none'}} type="file" accept=".jpg,.png,.jpeg" onChange={pickedHandler}/>
            <div className={`image-upload ${center && 'center'}`}>
                <div className="image-upload__preview" >
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{errorText}</p>}
        </div>
    )
}

export default ImageUpload