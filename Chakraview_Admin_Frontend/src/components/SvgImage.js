const SvgImage = ({ status }) => {
    return (
        <>
            <div className="success-icon">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={status === "Success" ? "currentColor" : "red"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    {status === "Success" ? <path d="m9 12 2 2 4-4" /> :
                        <>
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </>}
                </svg>
            </div>

            <h4 className="fw-bold">{status === "Success" ? "Payment Successful" : status === "Failure" ? "Payment Failure" : "Payment Cancelled"}
            </h4>
            {/* <p className="text-muted"> {status === "Success" && "Thank you for your purchase!"}</p> */}
            {/* <h4 className="fw-bold">{title}</h4>
            <p className="text-muted">{description}</p> */}
        </>
    )
}

export default SvgImage;