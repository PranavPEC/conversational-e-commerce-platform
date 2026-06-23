import { useState } from "react";
function useToast(){
     const [toast, setToast] = useState(null)
      const [toastVisible, setToastVisible] = useState(false)
    
      const showToast = (msg) => {
        setToast(msg)
        setToastVisible(false)
        setTimeout(() => setToastVisible(true), 10)
        setTimeout(() => setToastVisible(false), 2600)
        setTimeout(() => setToast(null), 3000)
      }
    
      const dismissToast = () => {
        setToastVisible(false)
        setTimeout(() => setToast(null), 300)
      }
      return {toast,showToast,dismissToast,setToast,setToastVisible,toastVisible};
    
}
export default useToast;