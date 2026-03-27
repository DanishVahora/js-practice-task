const { z } = window.Zod
const form = document.getElementById('form');
const msg = document.getElementById('clientMsg')


form.addEventListener("submit", (e) => {
    e.preventDefault()
    const schema = z.object({
        name: z.string().min(6, "Name must be 6 chars !!"),
        email: z.string().refine(val => val.includes("@gmail.com"), {
            message: "Gmail must be valid form"
        }),
        password: z.string().min(8, "Must be 8 character long")
            .regex(/[A-Z]/, "Must contain one uppercase")
            .regex(/[a-z]/, "Must contain one lowercase")
            .regex(/[0-9]/, "Must contain atleast one number")
            .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
        age: z.coerce.number().min("Age must be >18")
    });

    const formData = new FormData(form);
    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        age: formData.get("age")
    }
    const result = schema.safeParse(data)

    if (!result.success) {
        msg.innerHTML = result.error.issues[0].message
    }
    else {
        form.submit()
        msg.innerHTML = "successful"
    }
})