// input-otp wrapper — matches Kisan-e-Mandi design system
import { OTPInput, OTPInputContext } from "input-otp";
import { useContext } from "react";
import { FaMinus } from "react-icons/fa";

export function InputOTP({ maxLength, value, onChange, disabled, children, ...props }) {
    return (
        <OTPInput
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            disabled={disabled}
            containerClassName="flex items-center gap-2"
            {...props}
        >
            {children}
        </OTPInput>
    );
}

export function InputOTPGroup({ children }) {
    return <div className="flex items-center gap-2">{children}</div>;
}

export function InputOTPSlot({ index }) {
    const inputOTPContext = useContext(OTPInputContext);
    const { slots } = inputOTPContext;
    const slot = slots[index];
    const { char, hasFakeCaret, isActive } = slot;

    return (
        <div
            className={`
        relative w-11 h-14 text-xl font-semibold rounded-xl border-2 transition-all duration-200
        flex items-center justify-center select-none
        ${isActive
                    ? "border-green-500 ring-2 ring-green-200 bg-green-50 scale-105"
                    : char
                        ? "border-green-400 bg-white"
                        : "border-gray-200 bg-gray-50"
                }
      `}
        >
            {char ?? ""}
            {hasFakeCaret && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-px h-6 bg-green-600 animate-pulse" />
                </div>
            )}
        </div>
    );
}

export function InputOTPSeparator() {
    return (
        <div className="text-gray-300">
            <FaMinus />
        </div>
    );
}
