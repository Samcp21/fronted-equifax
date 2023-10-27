<template>
    <v-app>
        <slot name="toolbar" />
        <v-main>
            <slot name="pages" />
        </v-main>
        <slot name="footer" />
    </v-app>
</template>
