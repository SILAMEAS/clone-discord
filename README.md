- Next Prisma Socket.io Tailwind
- I change from Next13 to Next14

- clerk : third party to make authentication
- uploadthing : to store image
- zod : to validation form
- next-theme : to control mode
- shadcn.ui  : to manage style it flexible and easy customize because it use full of tailwind code
- cn : is the best way to validate condition to apply style 
- best structure to learn as best practise
- zustand : state management

ready time you modify your schema you must run this script:

1. npx prisma generate
2. npx prisma db push

if your data still having while you already run both script above you can run script : npx prisma migrate reset

delete nodules : rm -rf node_modules