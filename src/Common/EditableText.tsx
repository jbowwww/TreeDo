import { useState, ChangeEvent, useEffect, useRef, CSSProperties } from 'react';

export interface EditableTextProps {
    name: string;
    value?: string;
    isEditing?: boolean;
    onChange?: (value: string) => void;
    onEditing?: () => void;
    onBlur?: (value: string) => void;
    onEnded?: (value: string) => void;
};

export const EditableText = (props: EditableTextProps & { style?: CSSProperties }) => {
    const [isEditing, setIsEditing] = useState(props.isEditing ?? false);
    const [text, setText] = useState<string | undefined>(props.value);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDoubleClick = () => {
        setIsEditing(true);
        props.onEditing?.();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

    const style = props.style ?? { minWidth: "4em", width: "100%" };

    return (
        <span
            style={style}
            onDoubleClick={handleDoubleClick}
        >
            {isEditing ? (
                <input
                    style={style}
                    type="text"
                    name={props.name}
                    value={text ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onEnded={handleEnded}
                    ref={inputRef}
                />
            ) : (
                text
                    ? (<span style={style}>{text}</span>)
                    : (<span style={style}>&nbsp;</span>)
            )}
        </span>
    );
};

export default EditableText;
