import { useState } from "react";
import Input from "../components/ui/Input";
import BreastBeaconLogo from "../Logo/Logo";


export const LoginPage = () => {
    

    const [email, setEmail] = useState("");

    const handleEmail = (e:React.ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value)};

    return (
        <div className="flex flex-col pt-6 bg">
            <BreastBeaconLogo />
            <div className="flex flex-col items-center pt-4 pb-9 font-bold text-6xl text-blue-800">
                <h1>Login</h1> 
            </div>
            <div className="flex flex-row items-center justify-center">
                <Input 
                name={"email"}
                type="text"
                value={email}
                onChange={handleEmail}
                placeholder="Please Enter Your Email"
                className="w-100 text-center"
                />
            </div>
        </div>
    )

}