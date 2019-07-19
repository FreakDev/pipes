import React, { useRef } from "react"
import View from "./view"

import useDrop from "../../../../hooks/useDrop"

export default ({ children, onDrop, classNames, onDragOver, onDragLeave }) => {
    const dropRef = useRef()
    const { dropState, droppedItem } = useDrop({
        ref: dropRef,
        onDrop,
        onDragOver,
        onDragLeave
    })
    return (
        <View ref={dropRef} classNames={classNames}>
            {children}
        </View>
    )
};
