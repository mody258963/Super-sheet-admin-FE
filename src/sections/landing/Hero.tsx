'use client';

// next
import Link from 'next/link';

// material-ui
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Links from '@mui/material/Link';
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import { techData } from 'data/tech-data';
import { useIspValue } from 'hooks/useIspValue';

// third-party
import { motion } from 'framer-motion';

// ==============================|| LANDING - HERO PAGE ||============================== //


export default function HeroPage() {
  const ispValueAvailable = useIspValue();



  // const techBottom = techData.map((item, index) => {
  //   const finalUrl = item.url !== '#!' && ispValueAvailable ? `${item.url}?isp=1` : item.url;
  //   return (
  //     <Grid key={index} sx={{ minWidth: { xs: 60, md: 90 } }}>
  //       <motion.div
  //         initial={{ opacity: 0, translateY: 550 }}
  //         animate={{ opacity: 1, translateY: 0 }}
  //         transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.8 }}
  //       >
  //         <Tooltip title={item.tooltipTitle}>
  //           <Links component={Link} href={finalUrl} target={item.target}>
  //             <CardMedia component="img" image={item.image} sx={{ width: 'auto', height: { xs: 60, md: 'auto' } }} />
  //           </Links>
  //         </Tooltip>
  //       </motion.div>
  //     </Grid>
  //   );
  // });



  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', pb: 12.5, pt: 10, display: 'flex', alignItems: 'center' }}>
      <Container>
        <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', pt: { md: 0, xs: 10 }, pb: { md: 0, xs: 22 } }}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Grid container spacing={3} sx={{ textAlign: 'center' }}>
              <Grid size={12}>
                <motion.div
                  initial={{ opacity: 0, translateY: 550 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 30
                  }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '1.825rem', sm: '2rem', md: '3.4375rem' },
                      fontWeight: 700,
                      lineHeight: 1.2
                    }}
                  >
                    Progress starts with {' '}
                    <Typography
                      variant="h1"
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        background: 'linear-gradient(90deg, rgb(37, 161, 244), rgb(249, 31, 169), rgb(37, 161, 244)) 0 0 / 400% 100%',
                        color: 'transparent',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        animation: 'move-bg 24s infinite linear',
                        '@keyframes move-bg': { '100%': { backgroundPosition: '400% 0' } }
                      }}
                    >
                      a plan—track it
                    </Typography>{' '}
                    tweak it, train harder.
                  </Typography>
                </motion.div>
              </Grid>
              <Grid container size={12} sx={{ justifyContent: 'center' }}>
                <Grid size={8}>
                  <motion.div
                    initial={{ opacity: 0, translateY: 550 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 150,
                      damping: 30,
                      delay: 0.2
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 400,
                        lineHeight: { xs: 1.4, md: 1.4 }
                      }}
                    >
                      A powerful all-in-one dashboard for coaches to manage client workouts, diets, and progress with ease.
                    </Typography>
                  </motion.div>
                </Grid>
              </Grid>
              <Grid size={12}>
                <motion.div
                  initial={{ opacity: 0, translateY: 550 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 30,
                    delay: 0.4
                  }}
                >
                  <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                    <Grid>
                      <AnimateButton>
                        <Button
                          component={Link}
                          href="/login"
                          size="large"
                          color="secondary"
                          variant="outlined"
                        >
                         Get Started
                        </Button>
                      </AnimateButton>
                    </Grid>
                  </Grid>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
