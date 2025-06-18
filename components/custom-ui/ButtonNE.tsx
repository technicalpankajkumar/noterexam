import { Button, ButtonGroup, ButtonSpinner, ButtonText } from "@components/ui/button";


type ButtonProps = {
    loading?: boolean;
    className?: string;
    title?: string;
    onPress?: () => void;
    disabled?: boolean;
};

export default function ButtonNE({
    loading,
    title,
    className,
    onPress,
    disabled,
}: ButtonProps) {

    return (<ButtonGroup className='mb-6'>
        <Button
        size="sm"
            className={className || "bg-[#4A90E2]"}
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }: { pressed: boolean }) => ({
                borderRadius: 8,
                backgroundColor: '#4A90E2',
                opacity: loading ? 0.7 : 1,
                elevation: 0, // removes Android shadow
                transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
            android_ripple={{ color: '#4A90E2', borderless: false }}
        >
            <ButtonText style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{title || "Login"}</ButtonText>
            {loading && <ButtonSpinner animating={loading} />}
        </Button>
    </ButtonGroup>)
}