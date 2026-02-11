import { Outlet } from "react-router-dom";

const authVideo = new URL(
    "../../../videos/20260211_1126_New Video_simple_compose_01kh5wxkztex6ac841pc3ccqpr.mp4",
    import.meta.url,
).href;

export function PublicLayout() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            <video
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
            >
                <source src={authVideo} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-neutral-950/45" />
            <div className="relative">
                <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
                    <main className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur dark:bg-neutral-950/85">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
