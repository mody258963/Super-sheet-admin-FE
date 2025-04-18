// material-ui
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { motion } from 'framer-motion';

// project-imports
import Logo from 'components/logo';

// assets
import { Dribbble, Facebook, Instagram, Youtube } from '@wandersonalwes/iconsax-react';
import GithubIcon from '../../../public/assets/third-party/github';

// link - custom style
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover, &:active': {
    color: theme.palette.primary.main
  }
}));

type showProps = {
  isFull?: boolean;
};

// ==============================|| LANDING - FOOTER PAGE ||============================== //

export default function FooterBlock({ isFull }: showProps) {
  const linkSX = { color: 'text.secondary', fontWeight: 400, opacity: '0.6', cursor: 'pointer', '&:hover': { opacity: '1' } };

  return (
    <>
      <Box sx={{ pt: isFull ? 5 : 10, pb: 10, bgcolor: 'secondary.200', borderColor: 'divider' }}>
        <Container>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Logo to="/" />
                  </Grid>
                  <Grid size={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 400, maxWidth: 320 }}>
                      Phoenixcoded has gained the trust of over 5.5K+ customers since 2015, thanks to our commitment to delivering
                      high-quality products. Our experienced team players are responsible for managing Able Pro.
                    </Typography>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={{ xs: 5, md: 2 }}>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Stack sx={{ gap: 3 }}>
                    <Typography variant="h5">Company</Typography>
                    <Stack sx={{ gap: { xs: 1.5, md: 2.5 } }}>
                      <FooterLink href="" target="_blank" underline="none">
                        About Us
                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                      Testimonials
                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                      Careers
                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                      Blog
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Stack sx={{ gap: 3 }}>
                    <Typography variant="h5">Help & Support</Typography>
                    <Stack sx={{ gap: { xs: 1.5, md: 2.5 } }}>
                      <FooterLink href="" target="_blank" underline="none">
                      Submit Feedback                      
                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                      Product Roadmap
                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                      Contact Support
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 6, sm: 4 }}>
                  <Stack sx={{ gap: 3 }}>
                    <Typography variant="h5">Useful Resources</Typography>
                    <Stack sx={{ gap: { xs: 1.5, md: 2.5 } }}>
                      <FooterLink href="" target="_blank" underline="none">
                      Privacy Policy                      </FooterLink>
                      <FooterLink href="" target="_blank" underline="none">
                      Terms & Conditions                    
                        </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box sx={{ py: 2.4, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'secondary.200' }}>
        <Container>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <Typography>
              © Handcrafted with ❤️ by Team {' '}
                <Link href="https://themeforest.net/user/phoenixcoded" target="_blank" underline="none">
                  {' '}
                  Super Cheats
                </Link>
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
                <Grid>
                  <Tooltip title="Github">
                    <Link href="https://github.com/phoenixcoded" underline="none" target="_blank" sx={linkSX}>
                      <Instagram size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid>
                  <Tooltip title="Facebook">
                    <Link href="" underline="none" target="_blank" sx={linkSX}>
                      <Facebook variant="Bold" size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid>
                  <Tooltip title="Youtube">
                    <Link href="https://www.youtube.com/@phoenixcoded" underline="none" target="_blank" sx={linkSX}>
                      <Youtube variant="Bold" size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
