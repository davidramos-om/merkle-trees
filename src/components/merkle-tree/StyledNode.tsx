export function StyledNode({ children }: { children: React.ReactNode; }) {
    return (
        <div
            style={{
                border: '1px solid black',
                padding: '10px',
                borderRadius: '5px',
                display: 'inline-block',
            }}
        >
            {children}
        </div>
    );
}
