import { Link } from "react-router-dom";
import { MapPage } from "@/pages/map/MapPage";

export function HomePage() {
    return (
        <div className="space-y-8">
            <section className="rounded-3xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white p-8 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-900">
                <div className="max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        Backend is running • Frontend is running
                    </div>

                    <h1 className="text-4xl font-semibold tracking-tight">
                        EternalLight.
                        <span className="text-neutral-500 dark:text-neutral-400"> Управление уличным освещением.</span>
                    </h1>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            to="/map"
                            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90"
                        >
                            Open Map
                        </Link>
                        <Link
                            to="/acts"
                            className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                        >
                            Open Acts
                        </Link>
                    </div>
                </div>
            </section>

            <MapPage />
        </div>
    );
}
