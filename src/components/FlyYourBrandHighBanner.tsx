import React from "react";

/**
 * Banner قريب جدًا من شكل الصورة (خلفية جريدينت + جزء يمين أسود + ظل مائل + نفس توزيع الكلام).
 * ملاحظة: لو عايز “Your” بنفس إحساس الخط في الصورة تمامًا، استخدم خط سكربت (مثلاً Pacifico/Dancing Script).
 */

export default function FlyYourBrandHighBanner() {
    return (
        <div style={styles.wrap}>
            <div style={styles.card}>
                {/* الطبقة المائلة الداكنة */}
                <div style={styles.slant} />

                {/* المحتوى */}
                <div style={styles.content} dir="ltr" className="exclude-rtl">


                    {/* النص */}
                    <div style={styles.text}>
                        <div style={styles.line1}>
                            <span style={styles.fly}>FLY</span>{" "}
                            <span style={styles.your}>Your</span>
                        </div>

                        <div style={styles.line2}>
                            <span style={styles.brand}>BRAND</span>{" "}
                            <span style={styles.high}>HIGH</span>
                        </div>

                        <div style={styles.line3}>WITH US.</div>
                    </div>
                </div>
            </div>

            {/* خطوط مقترحة (اختياري) */}

        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    wrap: {
        fontFamily:
            'Gotham Pro, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
        padding: 16,
        background: "#0b0b0b",
        minHeight: "50vh", // Changed from 100vh to fit better in a page flow
        display: "grid",
        placeItems: "center",
        gap: 12,
    },

    card: {
        position: "relative",
        width: "min(920px, 96vw)",
        height: "min(210px, 26vw)",
        minHeight: 140,
        borderRadius: 14,
        overflow: "hidden",
        // جريدينت قريب من الصورة (بنفسجي/وردي لحد أسود)
        background:
            "linear-gradient(90deg, #ff4fb8 0%, #b44bff 35%, #351a66 55%, #070707 74%, #000 100%)",
        boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
    },

    // ظل/قَطع مائل جهة اليمين زي الصورة
    slant: {
        position: "absolute",
        inset: 0,
        background:
            "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.75) 100%)",
        pointerEvents: "none",
    },

    content: {
        position: "relative",
        zIndex: 1,
        height: "100%",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
        columnGap: 18,
        padding: "22px 26px",
        color: "white",
    },



    text: {
        lineHeight: 1,
        letterSpacing: "0.5px",
    },

    line1: {
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        marginBottom: 6,
        whiteSpace: "nowrap",
    },

    fly: {
        fontWeight: 800,
        fontSize: "clamp(26px, 5.2vw, 54px)",
    },

    // “Your” سكربت + جريدينت ذهبي/وردي زي اللمعة اللي في الصورة
    your: {
        fontFamily: 'Dancing Script, Pacifico, "Brush Script MT", cursive',
        fontWeight: 700,
        fontSize: "clamp(22px, 4.8vw, 52px)",
        background: "linear-gradient(90deg, #f6d07a 0%, #ff6bd6 55%, #b44bff 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        transform: "translateY(2px)",
    },

    line2: {
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        whiteSpace: "nowrap",
    },

    brand: {
        fontWeight: 900,
        fontSize: "clamp(30px, 6.2vw, 70px)",
    },

    high: {
        fontWeight: 900,
        fontSize: "clamp(30px, 6.2vw, 70px)",
    },

    line3: {
        marginTop: 8,
        fontWeight: 700,
        fontSize: "clamp(14px, 2.3vw, 22px)",
        opacity: 0.95,
        letterSpacing: "2px",
    },

    note: {
        margin: 0,
        fontSize: 12,
        color: "rgba(255,255,255,0.65)",
        maxWidth: 920,
        textAlign: "center",
    },
};
