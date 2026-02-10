import { Link } from "react-router-dom";

export function HomePage() {
    return (
        <div className="space-y-10">
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

                    <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                        Здесь будет личный кабинет, авторизация, админка и полный цикл работы с актами,
                        объектами освещения и справочниками. Начинаем с чистого интерфейса и строгой структуры.
                    </p>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Link
                            to="/organizations"
                            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white shadow-sm hover:opacity-90"
                        >
                            Open Organizations
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <Card title="Чёткая архитектура" text="FSD-структура, единый стиль, предсказуемые зависимости." />
                <Card title="REST интеграция" text="Единый http-клиент, типы DTO, обработка ошибок, CRUD." />
                <Card title="Theme & Auth" text="Dark/Light, контекст авторизации, protected routes позже." />
            </section>
        </div>
    );
}

function Card(props: { title: string; text: string }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="text-sm font-semibold">{props.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{props.text}</div>
        </div>
    );
}
