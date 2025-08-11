'use client';
import { checkRoles } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
    const roles = checkRoles();
    const router = useRouter();
    useEffect(() => {
        if (roles.includes("admin")) {
            router.push(`/admin`)
        } else (
            router.push(`/user`)
        )
    })
};
