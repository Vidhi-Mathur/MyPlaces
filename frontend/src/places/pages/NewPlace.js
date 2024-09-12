import {useContext} from "react";
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/imageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import './PlaceForm.css'


const NewPlace = () => {
    const auth = useContext(AuthContext)
    const navigate = useNavigate()
    const {isLoading, error, sendRequest, clearError} = useHttpClient()
    const[formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false
    )
   
    const addPlaceHandler = async event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('title', formState.inputs.title.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('address', formState.inputs.address.value);
        formData.append('creator', auth.userId);
        formData.append('image', formState.inputs.image.value);
        try{
            await sendRequest(process.env.REACT_APP_URL + '/places/new', 'POST', formData, {
                Authorization: 'Bearer ' + auth.token
            })
            navigate('/')
        } 
        catch(err) {
            console.log(err.message)
        }
    }

    return (
    <>
        <ErrorModal error={error} onClear={clearError}/>
        <form className="place-form" onSubmit={addPlaceHandler}>
            {isLoading && <LoadingSpinner asOverlay/>}
            <Input id="title"element="input" type="text" label="Title" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid text" onInput={inputHandler}/>
            <Input id="description"element="textarea" label="Description" validators={[VALIDATOR_MINLENGTH(5)]} errorText="Please enter a valid description with atleast 5 characters" onInput={inputHandler}/>
            <Input id="address"element="textarea" label="Address" validators={[VALIDATOR_REQUIRE()]} errorText="Please enter a valid Address" onInput={inputHandler}/>
            <ImageUpload id="image" onInput={inputHandler} errorText="Please Provide an Image"/>
            <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
        </form>
    </>
    )
}

export default NewPlace