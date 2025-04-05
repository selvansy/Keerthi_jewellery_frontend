  export const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (500KB limit)
            if (file.size > 500 * 1024) {
                toast.error("File size exceeds 500KB.");
                return;
            }

            setFormData((prev) => ({ ...prev, noti_image: file.name }));

            const imageUrl = URL.createObjectURL(file);
            setPathurl(imageUrl);
        }
    };