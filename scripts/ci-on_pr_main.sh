echo "Starting CI on-pr-main (ci-on_pr_main.sh)..."

echo "ci-on_pr_main: starting linting..."
chmod +x ./scripts/lint.sh
LINT_ERROR_LIST=$(./scripts/lint.sh)
if [[ $? -eq 0 ]]; then
    echo "ci-on_pr_main: Linting OK"
else 
    echo "ci-on_pr_main: Linting failed. See the results:"
    echo "$LINT_ERROR_LIST"
    exit 1
fi

echo "ci-on_pr_main: Done."
exit 0