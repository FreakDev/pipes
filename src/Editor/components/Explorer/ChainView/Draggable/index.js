import React, { useRef } from "react"
import View from "./view"

import useDrag from "../../../../hooks/useDrag"

export default ({ children, id, classNames, onDragStart, onDragEnd }) => {
    const dragRef = useRef()
    const { dragState } = useDrag({
        id,
        ref: dragRef,
        onDragStart,
        onDragEnd
    })
    return <View ref={dragRef} classNames={ classNames }>
        {children}
    </View>
}
