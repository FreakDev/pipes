import React, { forwardRef } from "react"

export default forwardRef(({ children, classNames = [] }, ref) => {
    return (
        <div className={ classNames.join(" ") } ref={ref}>
            {children}
        </div>
    )
})
