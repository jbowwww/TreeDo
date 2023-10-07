import { useState, ChangeEvent, useEffect, useRef, Attributes, MutableRefObject, CSSProperties } from 'react';

export interface EditableTextProps extends Attributes {
    id: string;
    value?: string;
    multiple?: boolean;
    isEditing?: boolean;
    onChange?: (value: string) => void;
    onEditing?: () => void;
    onBlur?: (value: string) => void;
    onEnded?: (value: string) => void;
};

export const EditableText = (props: EditableTextProps) => {
    const [isEditing, setIsEditing] = useState(props.isEditing ?? false);
    const [text, setText] = useState<string | undefined>(props.value);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const handleDoubleClick = () => {
        setIsEditing(true);
        props.onEditing?.();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(e.target.value);
        props.onChange?.(e.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        props.onBlur?.(inputRef?.current?.value ?? "");
    };

    const handleEnded = () => {
        props.onEnded?.(text ?? "");
    }

    // Focus the input field when editing starts
    useEffect(() => {
        if (isEditing) {
            inputRef?.current?.focus();
        }
    }, [isEditing]);

    const style: CSSProperties = {
        width: "100%",
        height: "100%",
        boxSizing: "border-box", 
        padding: "2px",
        margin: "0px",
        border: "none",
    };

    return (
        <div id={props.id} style={{ boxSizing: "content-box" }}>
            {isEditing ?
                (props.multiple ?
                    (<textarea
                        style={style}
                        name={props.id}
                        value={text ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onEnded={handleEnded}
                        ref={inputRef as MutableRefObject<HTMLTextAreaElement>}
                    />) :
                    (<input
                        style={style}
                        type="text"
                        name={props.id}
                        value={text ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onEnded={handleEnded}
                        ref={inputRef as MutableRefObject<HTMLInputElement>}
                    />)) : (text ?
                    (<div style={style} onDoubleClick={handleDoubleClick}>{text}</div>)
                    : (<div style={style} onDoubleClick={handleDoubleClick}>&nbsp;</div>))
            }
        </div>);
};

export default EditableText;
