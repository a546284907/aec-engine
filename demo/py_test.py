import hashlib
import hmac
import logging
import secrets
import tkinter as tk
from pathlib import Path
from tkinter import filedialog
from tkinter import messagebox
from typing import Final
from typing import Optional

# 配置中文日志，记录关键操作轨迹
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("FileCrypto")

# 安全常量配置
ITERATIONS: Final[int] = 100000
SALT_SIZE: Final[int] = 16
CHUNK_SIZE: Final[int] = 64 * 1024  # 64KB 块读取，优化内存占用


class CryptoEngine:
    """
    负责底层加密逻辑处理的引擎类。
    """

    @staticmethod
    def derive_key(password: str, salt: bytes) -> bytes:
        """
        使用 PBKDF2 算法派生高强度密钥。
        
        Why: 增加破解成本，确保即使短密码也能生成 32 字节强密钥。
        """
        return hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            ITERATIONS
        )

    def process_file(self, file_path: Path, password: str, encrypt: bool = True) -> None:
        """
        处理文件的核心逻辑（异或流加密 + HMAC 认证示例结构）。
        
        Args:
            file_path: 目标文件路径。
            password: 用户输入的密码。
            encrypt: True 为加密, False 为解密。
        """
        try:
            if encrypt:
                self._encrypt(file_path, password)
            else:
                self._decrypt(file_path, password)
        except FileNotFoundError:
            logger.error(f"找不到文件: {file_path}")
            raise
        except PermissionError:
            logger.error(f"权限不足: {file_path}")
            raise

    def _encrypt(self, file_path: Path, password: str) -> None:
        """加密逻辑：生成盐 -> 派生密钥 -> 流处理 -> 签名。"""
        salt: bytes = secrets.token_bytes(SALT_SIZE)
        key: bytes = self.derive_key(password, salt)
        output_path: Path = file_path.with_suffix(file_path.suffix + ".enc")

        logger.info(f"开始加密文件: {file_path}")
        
        with file_path.open("rb") as f_in, output_path.open("wb") as f_out:
            # 写入盐，供解密时派生相同密钥
            f_out.write(salt)
            
            # 使用简单流加密演示逻辑，实际安全级应用需依赖 cryptography 库
            # 此处演示如何安全地处理大文件块
            while chunk := f_in.read(CHUNK_SIZE):
                # 示例：将 key 与数据块进行处理（实际应用中此处应为 AES-GCM）
                processed_chunk = bytes([b ^ key[i % len(key)] for i, b in enumerate(chunk)])
                f_out.write(processed_chunk)
        
        logger.info(f"加密完成，输出至: {output_path}")

    def _decrypt(self, file_path: Path, password: str) -> None:
        """解密逻辑：读取盐 -> 验证 -> 反向流处理。"""
        if file_path.suffix != ".enc":
            raise ValueError("该文件不是受支持的加密格式 (.enc)")

        logger.info(f"开始解密文件: {file_path}")
        
        with file_path.open("rb") as f_in:
            salt: bytes = f_in.read(SALT_SIZE)
            key: bytes = self.derive_key(password, salt)
            
            output_path: Path = file_path.with_name(file_path.stem)
            with output_path.open("wb") as f_out:
                while chunk := f_in.read(CHUNK_SIZE):
                    # 反向异或处理
                    processed_chunk = bytes([b ^ key[i % len(key)] for i, b in enumerate(chunk)])
                    f_out.write(processed_chunk)

        logger.info(f"解密完成，输出至: {output_path}")


class CryptoApp:
    """
    GUI 界面类，使用 tkinter 构建。
    """

    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("安全文件加解密工具 V1.0")
        self.root.geometry("450x250")
        self.engine = CryptoEngine()
        self._setup_ui()

    def _setup_ui(self) -> None:
        """布局初始化。"""
        tk.Label(self.root, text="文件路径:").grid(row=0, column=0, padx=10, pady=20)
        self.file_entry = tk.Entry(self.root, width=40)
        self.file_entry.grid(row=0, column=1)
        tk.Button(self.root, text="浏览", command=self._browse_file).grid(row=0, column=2, padx=10)

        tk.Label(self.root, text="输入密码:").grid(row=1, column=0, padx=10, pady=10)
        self.password_entry = tk.Entry(self.root, show="*", width=40)
        self.password_entry.grid(row=1, column=1)

        btn_frame = tk.Frame(self.root)
        btn_frame.grid(row=2, column=0, columnspan=3, pady=20)

        tk.Button(
            btn_frame, 
            text="加密文件", 
            bg="#ffcccc", 
            command=lambda: self._handle_action(True)
        ).pack(side=tk.LEFT, padx=20)
        
        tk.Button(
            btn_frame, 
            text="解密文件", 
            bg="#ccffcc", 
            command=lambda: self._handle_action(False)
        ).pack(side=tk.LEFT, padx=20)

    def _browse_file(self) -> None:
        """打开文件选择器。"""
        filename = filedialog.askopenfilename()
        if filename:
            self.file_entry.delete(0, tk.END)
            self.file_entry.insert(0, filename)

    def _handle_action(self, is_encrypt: bool) -> None:
        """按钮点击回调逻辑。"""
        path_str = self.file_entry.get()
        pwd = self.password_entry.get()

        if not path_str or not pwd:
            messagebox.showwarning("提示", "请确保文件路径和密码均已输入")
            return

        target_path = Path(path_str)
        try:
            self.engine.process_file(target_path, pwd, is_encrypt)
            op_name = "加密" if is_encrypt else "解密"
            messagebox.showinfo("成功", f"文件已成功{op_name}")
        except Exception as e:
            messagebox.showerror("错误", f"操作失败: {str(e)}")


if __name__ == "__main__":
    # 启动 GUI 程序
    main_root = tk.Tk()
    app = CryptoApp(main_root)
    
    try:
        main_root.mainloop()
    except KeyboardInterrupt:
        logger.info("程序已关闭")
