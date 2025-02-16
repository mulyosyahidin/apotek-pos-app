import * as Headless from '@headlessui/react'
import { forwardRef } from 'react'
import {Link} from "@inertiajs/react";

export const AppLink = forwardRef(function AppLink(props, ref) {
    return (
        <Headless.DataInteractive>
            <Link {...props} ref={ref} />
        </Headless.DataInteractive>
    )
})
