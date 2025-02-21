
import axios from "axios";
import { User } from "firebase/auth";
import { toast } from "sonner";



// Upload image and return image url 
export const imageUpload = async (imageData: string | Blob) => {

    const formData = new FormData()
    formData.append('file', imageData);
    formData.append('upload_preset', 'nafiz_vai_cloudinary');

    const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`, formData)

    return data.secure_url
}

// 
export const saveUser = async (user : User) => {
    try {
        await axios.post(`http://localhost:3001/users`, {
            name: user?.displayName,
            email: user?.email,
            image: user?.photoURL,
        })
    } catch (error) {
        toast.error("Error occurred")
        console.log(error)
    }
}
