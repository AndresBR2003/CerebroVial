import subprocess
import os
import sys
from datetime import datetime

def run_step(name, command, cwd=None):
    print(f"--- Running: {name} ---")
    start_time = datetime.now()
    try:
        result = subprocess.run(
            command, 
            cwd=cwd, 
            shell=True, 
            check=True, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.STDOUT,
            text=True
        )
        output = result.stdout
        status = "SUCCESS"
    except subprocess.CalledProcessError as e:
        output = e.stdout
        status = "FAILED"
    
    end_time = datetime.now()
    duration = end_time - start_time
    
    print(f"Status: {status} ({duration})")
    return {
        "name": name,
        "status": status,
        "output": output,
        "duration": str(duration)
    }

def main():
    report_lines = []
    report_lines.append("==========================================")
    report_lines.append(f" EVIDENCE REPORT - {datetime.now().isoformat()}")
    report_lines.append("==========================================\n")

    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Backend Tests
    # Assuming script is in root (or called from root). 
    # Adjust paths if script is in scripts/ folder but run from root.
    
    # Run Backend Tests
    backend_res = run_step(
        "Backend Unit Tests (with Coverage)", 
        "export PYTHONPATH=$PYTHONPATH:. && pytest --cov=src/prediction --cov-report=term-missing tests/prediction",
        cwd="CerebroVial"
    )
    report_lines.append(f"## 1. Backend Unit Tests: {backend_res['status']}")
    report_lines.append("```")
    report_lines.append(backend_res['output'])
    report_lines.append("```\n")

    # 2. Frontend Tests
    frontend_res = run_step(
        "Frontend Unit Tests",
        "npm run test",
        cwd="Frontend"
    )
    report_lines.append(f"## 2. Frontend Unit Tests: {frontend_res['status']}")
    report_lines.append("```")
    report_lines.append(frontend_res['output'])
    report_lines.append("```\n")

    # 3. Model Training & Metrics
    training_res = run_step(
        "Model Training & Metrics",
        "python scripts/train_models.py",
        cwd="CerebroVial"
    )
    report_lines.append(f"## 3. Model Training Metrics: {training_res['status']}")
    report_lines.append("```")
    report_lines.append(training_res['output'])
    report_lines.append("```\n")

    # Save Report
    with open("evidence_report.md", "w") as f:
        f.write("\n".join(report_lines))
    
    print("\nEvidence report generated: evidence_report.md")

if __name__ == "__main__":
    main()
