import requests
import json
from requests.auth import HTTPBasicAuth

# Configuración
JIRA_URL = "https://cerebrovial.atlassian.net"
EMAIL = "u202418685@upc.edu.pe"
API_TOKEN = "TU_API_TOKEN_AQUÍ"
BOARD_ID = 34

auth = HTTPBasicAuth(EMAIL, API_TOKEN)
headers = {"Accept": "application/json", "Content-Type": "application/json"}

def get_sprints():
    url = f"{JIRA_URL}/rest/agile/1.0/board/{BOARD_ID}/sprint"
    return requests.get(url, auth=auth).json().get('values', [])

def get_issues_in_sprint(sprint_id):
    url = f"{JIRA_URL}/rest/agile/1.0/sprint/{sprint_id}/issue"
    return requests.get(url, auth=auth).json().get('issues', [])

def delete_sprint(sprint_id):
    url = f"{JIRA_URL}/rest/agile/1.0/sprint/{sprint_id}"
    requests.delete(url, auth=auth)

def move_to_backlog(issue_keys):
    url = f"{JIRA_URL}/rest/api/3/issue/bulk" # No hay endpoint simple para mover a backlog via agile, pero podemos desvincular el sprint
    # En Jira Cloud, mover al backlog es poner sprint = null
    for key in issue_keys:
        u = f"{JIRA_URL}/rest/api/3/issue/{key}"
        p = {"fields": {"customfield_10020": None}} # customfield_10020 suele ser el campo de Sprint
        requests.put(u, data=json.dumps(p), headers=headers, auth=auth)

if __name__ == "__main__":
    print("🧹 Iniciando limpieza de Sprints...")
    sprints = get_sprints()
    
    sprint_counts = {}
    for s in sprints:
        name = s['name']
        s_id = s['id']
        issues = get_issues_in_sprint(s_id)
        print(f"Sprint '{name}' (ID: {s_id}) tiene {len(issues)} historias.")
        
        # Si el sprint está vacío o es un duplicado, lo borramos (pero guardamos sus historias si tiene)
        if name not in sprint_counts:
            sprint_counts[name] = {"id": s_id, "issues": [i['key'] for i in issues]}
        else:
            # Es un duplicado. Movemos sus historias al primero que encontramos con ese nombre.
            duplicate_issues = [i['key'] for i in issues]
            if duplicate_issues:
                print(f"📦 Moviendo historias de duplicado {s_id} al original {sprint_counts[name]['id']}...")
                url_move = f"{JIRA_URL}/rest/agile/1.0/sprint/{sprint_counts[name]['id']}/issue"
                requests.post(url_move, data=json.dumps({"issues": duplicate_issues}), headers=headers, auth=auth)
            
            print(f"🗑️ Borrando duplicado {s_id}...")
            delete_sprint(s_id)
            
    print("\n✨ Limpieza completada.")
