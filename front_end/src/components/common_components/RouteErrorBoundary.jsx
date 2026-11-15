import { Component } from 'react'
import i18n from '../../i18n/i18n.js'

class RouteErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Route rendering failed:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='w-full min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center gap-4 px-6 text-center'>
                    <p className='text-[var(--color-text-primary)]'>
                        {i18n.t('route_error_title', { ns: 'common' })}
                    </p>
                    <button
                        type='button'
                        onClick={() => window.location.reload()}
                        className='px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors duration-200 cursor-pointer'
                    >
                        {i18n.t('route_error_reload', { ns: 'common' })}
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default RouteErrorBoundary
