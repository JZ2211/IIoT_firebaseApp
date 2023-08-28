import { AuthErrorCodes } from 'firebase/auth';

export const txtEmail = document.querySelector('#txtEmail')
export const txtPassword = document.querySelector('#txtPassword')

export const txtDate = document.querySelector('#txtDate')
export const plotError = document.querySelector('#plotError')
export const plotErrorMessage = document.querySelector('#plotErrorMessage')
export const nodeError = document.querySelector('#nodeError')
export const nodeErrorMessage = document.querySelector('#nodeErrorMessage')


export const btnLogin = document.querySelector('#btnLogin')
export const btnSignup = document.querySelector('#btnSignup')

export const btnLogout = document.querySelector('#btnLogout')

export const divAuthState = document.querySelector('#divAuthState')
export const lblAuthState = document.querySelector('#lblAuthState')

export const divLoginError = document.querySelector('#divLoginError')
export const lblLoginErrorMessage = document.querySelector('#lblLoginErrorMessage')

export const showLoginForm = () => {
  login.style.display = 'block'
  app.style.display = 'none'  
}

export const showApp = () => {
  login.style.display = 'none'
  app.style.display = 'block'
}

export const hideLoginError = () => {
  divLoginError.style.display = 'none'
  lblLoginErrorMessage.innerHTML = ''
}

export const showLoginError = (error) => {
  divLoginError.style.display = 'block'    
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    lblLoginErrorMessage.innerHTML = `Wrong password. Try again.`
  }
  else {
    lblLoginErrorMessage.innerHTML = `Error: ${error.message}`      
  }
}

export const showLoginState = (user) => {
  //lblAuthState.innerHTML = `You're logged in as ${user.displayName} (uid: ${user.uid}, email: ${user.email}) `
  lblAuthState.innerHTML = `You're logged in as ${user.email}`
}

export const hidePlotError =() =>{
  plotError.style.display = 'none'
  plotErrorMessage.innerHTML = ''
}

export const showPlotError =() =>{
  plotError.style.display = 'block'
  plotErrorMessage.innerHTML = `Data is not available for the node. Please select another node.`
}

export const hideNodeError =() =>{
  nodeError.style.display = 'none'
  nodeErrorMessage.innerHTML = ''
}

export const showNodeError =() =>{
  nodeError.style.display = 'block'
  nodeErrorMessage.innerHTML = `Data is not available for this node. Please select another date.`
}

export const showNodePrompt =() =>{
  nodeError.style.display = 'block'
  nodeErrorMessage.innerHTML = `Please select a node.`
}

hideLoginError()