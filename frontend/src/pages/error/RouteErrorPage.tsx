import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export const RouteErrorPage = () => {
    const err = useRouteError();

    let title = "Ошибка";
    let message = "Что-то пошло не так";

    if (isRouteErrorResponse(err)) {
        title = `Ошибка ${err.status}`;
        message = err.statusText || message;
    } else if (err instanceof Error) {
        message = err.message;
    }

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-gray-600">{message}</p>

            <Link className="mt-4 inline-block text-sm underline" to="/">
                На главную
            </Link>
        </div>
    );
};
