import React from 'react'
import env from '@/env'
import { api } from '@/service/api'

const LoginPage = () => {

    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false)

    const loginHandler = async () => {

        try {
            const result = await api.post('/login', {
                username: username,
                password: password
            })

            console.log({
                username: username,
                password: password
            })

            console.log("result -->", result.data)
        } catch (error) {
            console.log("error -->", error);
        }
    }

    return (
        <div className="hero min-h-screen ">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="card flex-shrink-0 w-full max-w-sm shadow bg-base-100">
                    <h1 className="text-2xl text-center font-bold m-0 p-3">Login now!</h1>
                    <div className="divider h-0 m-0 p-0"></div>
                    <div className="card-body mt-0 pt-0">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                placeholder="email"
                                className="input input-bordered"
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="password"
                                className="input input-bordered"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                        <div className="form-control mt-6">
                            <button
                                className="btn btn-primary"
                                onClick={loginHandler}
                            >Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage