importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBKIVcGGB-zgjnurXuYPm2DPISTVMHABuM",
    projectId: "finance-app-b62c9",
    messagingSenderId: "714665007003",
    appId: "1:714665007003:web:bccc45a07a915e00cb733e",
});

const messaging = firebase.messaging();
