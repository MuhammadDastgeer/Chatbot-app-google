import { Button } from "./ui/button";

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M12 15a6 6 0 0 0 6-6"/>
        <path d="M12 9a6 6 0 0 1 6 6"/>
        <path d="M12 21a9 9 0 0 0 9-9"/>
        <path d="M3 12a9 9 0 0 1 9-9"/>
    </svg>
)

const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
)

export function SocialLogins({ label }: { label: string }) {
    return (
        <>
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        {label}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="!h-12">
                    <FacebookIcon />
                    <span>Facebook</span>
                </Button>
                <Button variant="secondary" className="!h-12">
                    <GoogleIcon />
                    <span>Google</span>
                </Button>
            </div>
        </>
    )
}
