import { StateCode, StateOption } from '../../config/states';

interface StateSelectorProps {
    value: StateCode;
    onChange: (state: StateCode) => void;
    states: StateOption[];
}

export default function StateSelector({ value, onChange, states }: StateSelectorProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Select state"
            style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1B2A4A',
                background: '#F2EFE6',
                border: '1px solid #C9C2B0',
                borderRadius: '2px',
                padding: '6px 10px',
                marginRight: '12px',
                cursor: 'pointer',
            }}
        >
            {states.map((state) => (
                <option key={state.code} value={state.code} disabled={!state.isLive}>
                    {state.name} {!state.isLive ? '(Coming soon)' : ''}
                </option>
            ))}
        </select>
    );
}