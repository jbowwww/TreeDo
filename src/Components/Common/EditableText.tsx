import { useState, ChangeEvent, useEffect, useRef, Attributes, MutableRefObject, CSSProperties } from 'react';

export interface EditableTextProps extends Attributes {
    className?: string;
    value?: string;
    placeholder?: string;
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
        //width: "auto",
        //height: "100%",
        //boxSizing: "border-box", 
        //padding: "2px",
        //margin: "0px",
        //border: "none",
    };

    return (
        //<div className={props.className} style={{ boxSizing: "content-box" }}>
            isEditing ?
                (props.multiple ?
                    (<textarea
                        style={style}
                        className={props.className}
                        name={props.className}
                        value={text ?? ""}
                        placeholder={props.placeholder ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onEnded={handleEnded}
                        ref={inputRef as MutableRefObject<HTMLTextAreaElement>}
                    />) :
                    (<input
                        style={style}
                        className={props.className}
                        type="text"
                        name={props.className}
                        value={text ?? ""}
                        placeholder={props.placeholder ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onEnded={handleEnded}
                        ref={inputRef as MutableRefObject<HTMLInputElement>}
                    />)) : (text || props.placeholder ?
                    (<div style={style} className={props.className} onDoubleClick={handleDoubleClick}>{text ?? props.placeholder}</div>)
                    : (<div style={style} className={props.className} onDoubleClick={handleDoubleClick}>&nbsp;</div>))
            
        //</div>
        );
};

export default EditableText;
