import re
import os
from pathlib import Path

md_file = 'Virtu_Capital_管理员端操作指南.md'  # 改成你的文件名

with open(md_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 提取所有图片链接
pattern = r'!\[.*?\]\((.*?)\)'
matches = re.findall(pattern, content)

print(f"共找到 {len(matches)} 个图片引用：\n")
print("=" * 60)

for i, path in enumerate(matches, 1):
    path = path.strip()
    print(f"\n[{i}] {path[:80]}{'...' if len(path)>80 else ''}")
    
    # 判断类型
    if path.startswith(('http://', 'https://', '//')):
        print("   → 类型: 🌐 网络链接")
        print("   → 处理: 需要下载到本地")
        
    elif path.startswith('data:image'):
        print("   → 类型: 📦 Base64 内嵌（图片已编码在文件里）")
        print("   → 处理: 无需额外文件，直接转网页即可")
        
    else:
        # 本地路径
        md_dir = Path(md_file).parent.resolve()
        
        # 尝试多种解析方式
        possible_paths = [
            md_dir / path,                    # 相对 md 文件
            Path(path).resolve(),              # 绝对路径
            md_dir / path.lstrip('/'),         # 去掉开头斜杠
            Path(os.path.expanduser(path)),    # 展开 ~
        ]
        
        found = False
        for p in possible_paths:
            if p.exists():
                print(f"   → 类型: 📁 本地文件")
                print(f"   → 找到: {p}")
                print(f"   → 大小: {p.stat().st_size / 1024:.1f} KB")
                found = True
                break
        
        if not found:
            print("   → 类型: ❓ 本地路径，但文件未找到")
            print(f"   → 尝试过的位置:")
            for p in possible_paths:
                print(f"      - {p}")

print("\n" + "=" * 60)
print("诊断完成。根据上面的类型提示，选择对应的处理方式。")