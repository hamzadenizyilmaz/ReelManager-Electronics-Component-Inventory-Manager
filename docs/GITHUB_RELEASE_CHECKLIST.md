# GitHub Release Checklist

Before publishing a release:

- [ ] Update version in frontend package.json
- [ ] Update backend package.json if needed
- [ ] Update CHANGELOG.md
- [ ] Confirm README installation steps
- [ ] Confirm `.env.example` files
- [ ] Run backend syntax check
- [ ] Run Prisma validate
- [ ] Run frontend production build
- [ ] Add screenshots under assets/screenshots
- [ ] Create GitHub release notes
- [ ] Tag version, for example `v2.1.0`

## Tag Example

```bash
git tag v2.1.0
git push origin v2.1.0
```
