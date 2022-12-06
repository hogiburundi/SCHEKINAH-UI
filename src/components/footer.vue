<template>
    <div class="nonprintable">
        <div class="footer">
            <span class="copy">
                Copyright&copy; <span class="brand">SCHEKINAH</span>
            </span>
			<hr>
			<span class="madeby">
                Developpé par
                <a href="http://www.hogi.bi" target="_blank" class="hogi">HOGI</a>
            </span>
        </div>
    </div>
</template>
<script>
</script>
<style scoped>
    .footer {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        background: var(--primary);
        color: white;
        position: relative;
        bottom: 0;
        left: 0;
        width: 100%;
        margin-top: 40px;
        z-index: 0;
    }
    .footer .brand {
        font-weight: 700;
        font-size: 18px;
    }
    .footer hr {
        width: 1px;
        border: none;
        height: 60%;
        margin:  0 8px;
        background: #fff;
    }
    .footer a {
        color: white;
        font-weight: 700;
        font-size: 18px;
    }
</style>
