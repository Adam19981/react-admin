import React, {useEffect, useRef, useState} from "react";
import '../login.scss'
import  classNames  from  'classnames'
import {ModelLoader, ThreeBase} from "@utils/three";

const Login =  () => {

    const pinBox = useRef<HTMLDivElement>(null)

    const [isLogin,setLogin] = useState(true)

    useEffect(() => {
        createThree()
    },[])

    function handleSignup(){
        pinBox.current!.style.transform = "translateX(80%)"
        setLogin(false)
    }

    function handleSignIn(){
        pinBox.current!.style.transform = "translateX(0%)"
        setLogin(true)
    }

    async function createThree(){
         const container = document.getElementById('three-container')
        if (!container)return
        const threeBase = new ThreeBase(container,{
            fov: 90,
            near: 0.1,
            far: 1000,
            position: [0, 10, 25],
            aspect: container.offsetWidth / container.offsetHeight
        }
        )
        const modelLoader = new ModelLoader(threeBase);

        const { scene} =   await  modelLoader.initExternalModel('/model.glb')

        scene.position.z = -5
        scene.position.y = -5
        threeBase.add(scene)

        threeBase.surroundCamera()
    }

  return (
      <div className="login-main">
          <div id="three-container"></div>
          <div className="container">
              <div className="welcome">
                  <div className="pinkbox" ref={pinBox}>
                      <div className={classNames({'signup':true,"nodisplay":isLogin})}>
                          <h1>register</h1>
                          <form autoComplete="off">
                              <input type="text" placeholder="username"/>
                              <input type="email" placeholder="email"/>
                              <input type="password" placeholder="password"/>
                              <input type="password" placeholder="confirm password"/>
                              <button className="button submit">create account </button>
                          </form>
                      </div>
                      <div className={classNames({'signin':true,"nodisplay":!isLogin})}>
                          <h1>sign in</h1>
                          <form className="more-padding" autoComplete="off">
                              <input type="text" placeholder="username"/>
                              <input type="password" placeholder="password"/>

                              <button className="button submit">login</button>
                          </form>
                      </div>
                  </div>
                  <div  className={classNames({'leftbox':true,"nodisplay":isLogin})}>
                      <h2 className="title"><span>BLOOM</span>&<br/>BOUQUET</h2>
                      <p className="desc">pick your perfect <span>bouquet</span></p>
                      {/*<img className="flower smaller" src="https://image.ibb.co/d5X6pn/1357d638624297b.jpg" alt="1357d638624297b" border="0"/>*/}
                      <p className="account">have an account?</p>
                      <button className="button" id="signin" onClick={handleSignIn}>login</button>
                  </div>
                  <div className={classNames({'rightbox':true,"nodisplay":!isLogin})}>
                      <h2 className="title"><span>BLOOM</span>&<br/>BOUQUET</h2>
                      <p className="desc"> pick your perfect <span>bouquet</span></p>
                      {/*<img alt="" className="flower" src="https://preview.ibb.co/jvu2Un/0057c1c1bab51a0.jpg"/>*/}
                      <p className="account">dont have an account?</p>
                      <button className="button" id="signup" onClick={handleSignup}>sign up</button>
                  </div>
              </div>
          </div>
      </div>

  )
};

export default Login;
