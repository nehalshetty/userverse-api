import { RepoInsight } from "../services/users/users.types";

/**
 * Fetch GitHub user repositories
 */
export async function fetchGitHubRepos(
  gitUserName: string
): Promise<RepoInsight[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${gitUserName}/repos?sort=updated&per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "userverse-api",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`GitHub user '${gitUserName}' not found`);
      }
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await response.json();

    // Ensure repos is an array
    if (!Array.isArray(repos)) {
      throw new Error("Unexpected response format from GitHub API");
    }

    // Map to our RepoInsight schema
    return repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
    }));
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to fetch GitHub repositories");
  }
}
