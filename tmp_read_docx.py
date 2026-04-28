import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text_from_docx(docx_path, out_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        
        WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        PARA = WORD_NAMESPACE + 'p'
        TEXT = WORD_NAMESPACE + 't'
        
        paragraphs = []
        for paragraph in tree.iter(PARA):
            texts = [node.text for node in paragraph.iter(TEXT) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        
        with open(out_path, 'w', encoding='utf-8') as f:
            for i, p in enumerate(paragraphs):
                f.write(f"[{i}] {p}\n")
            
    except Exception as e:
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        extract_text_from_docx(sys.argv[1], sys.argv[2])
